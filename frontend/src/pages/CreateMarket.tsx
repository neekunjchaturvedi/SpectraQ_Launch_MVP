import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, MARKET_ABI } from '@/lib/contracts';
import { parseEther } from 'viem';
import { useToast } from '@/hooks/use-toast';

interface Proposal {
  id: string;
  title: string;
  description: string;
  endDate: string;
  targetPrice?: string;
  direction?: 'increase' | 'decrease';
}

const CreateMarket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    endDate: '',
    minDeposit: '',
  });
  const [proposals, setProposals] = useState<Proposal[]>([
    { id: '1', title: '', description: '', endDate: '', targetPrice: '', direction: 'increase' }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { address } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const categories = ['crypto', 'gamers', 'sports', 'traders', 'politics', 'tech'];

  const addProposal = () => {
    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: '',
      description: '',
      endDate: '',
      targetPrice: '',
      direction: 'increase'
    };
    setProposals([...proposals, newProposal]);
  };

  const removeProposal = (id: string) => {
    if (proposals.length > 1) {
      setProposals(proposals.filter(p => p.id !== id));
    }
  };

  const updateProposal = (id: string, field: keyof Proposal, value: string) => {
    setProposals(proposals.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const generateProposalExamples = () => {
    const category = formData.category.toLowerCase();
    const examples = {
      crypto: [
        { title: 'BTC increases by $20,000', description: 'Bitcoin price will increase by $20,000 from current price', direction: 'increase', targetPrice: '20000' },
        { title: 'ETH decreases by $500', description: 'Ethereum price will decrease by $500 from current price', direction: 'decrease', targetPrice: '500' },
        { title: 'SOL increases by $50', description: 'Solana price will increase by $50 from current price', direction: 'increase', targetPrice: '50' }
      ],
      sports: [
        { title: 'Team wins championship', description: 'The selected team will win the championship', direction: 'increase', targetPrice: '' },
        { title: 'Player scores 30+ goals', description: 'Player will score 30 or more goals this season', direction: 'increase', targetPrice: '30' },
        { title: 'Team finishes in top 3', description: 'Team will finish in the top 3 positions', direction: 'increase', targetPrice: '' }
      ],
      default: [
        { title: 'Target achieved', description: 'The specified target will be achieved', direction: 'increase', targetPrice: '' },
        { title: 'Metric increases', description: 'The metric will show an increase', direction: 'increase', targetPrice: '' },
        { title: 'Goal reached', description: 'The goal will be reached within timeframe', direction: 'increase', targetPrice: '' }
      ]
    };

    const categoryExamples = examples[category as keyof typeof examples] || examples.default;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    setProposals(categoryExamples.map((example, index) => ({
      id: (Date.now() + index).toString(),
      title: example.title,
      description: example.description,
      direction: example.direction as 'increase' | 'decrease',
      targetPrice: example.targetPrice,
      endDate: endDate.toISOString().slice(0, 16)
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a market.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.endDate || !formData.minDeposit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate proposals
    const incompleteProposals = proposals.filter(p => !p.title || !p.description || !p.endDate);
    if (incompleteProposals.length > 0) {
      toast({
        title: "Incomplete Proposals",
        description: "Please fill in all proposal fields or remove incomplete proposals.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const endTime = Math.floor(new Date(formData.endDate).getTime() / 1000);
      const minDeposit = parseEther(formData.minDeposit);

      // Store market data with proposals in localStorage for now
      // In a real app, this would be stored in the smart contract or database
      const marketData = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        endDate: formData.endDate,
        minDeposit: formData.minDeposit,
        proposals: proposals.map(p => ({
          ...p,
          yesPrice: 0.5,
          noPrice: 0.5,
          volume: '$0',
          participants: 0,
          status: 'active' as const
        })),
        volume: '$0',
        participants: 0,
        yesPrice: 0.5,
        noPrice: 0.5,
        status: 'active' as const,
        creator: address,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage
      const existingMarkets = JSON.parse(localStorage.getItem('userMarkets') || '[]');
      localStorage.setItem('userMarkets', JSON.stringify([...existingMarkets, marketData]));

      // Call the contract to create market
      writeContract({
        address: CONTRACT_ADDRESSES.MARKET as `0x${string}`,
        abi: MARKET_ABI,
        functionName: 'createMarket',
        args: [{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          resolver: CONTRACT_ADDRESSES.BASIC_MARKET_RESOLVER as `0x${string}`,
          endTime: BigInt(endTime),
          minDeposit: minDeposit,
          marketToken: CONTRACT_ADDRESSES.VUSD as `0x${string}`,
        }],
      });

      toast({
        title: "Creating Market...",
        description: "Your transaction has been submitted. Please wait for confirmation.",
      });

    } catch (err) {
      console.error('Error creating market:', err);
      toast({
        title: "Creation Failed",
        description: "There was an error creating your market. Please try again.",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && isCreating) {
      setIsCreating(false);
      toast({
        title: "Market Created Successfully!",
        description: "Your prediction market has been deployed to the blockchain.",
      });
      navigate('/markets');
    }
  }, [isConfirmed, isCreating, toast, navigate]);

  useEffect(() => {
    if (error && isCreating) {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsCreating(false);
    }
  }, [error, isCreating, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-smooth">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Create New Market</CardTitle>
            <p className="text-muted-foreground">
              Create a prediction market for any real-world event
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Market Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium">
                  Market Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-card border-border"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about how this market will be resolved..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-card border-border min-h-[120px]"
                  required
                />
              </div>

              {/* Category and End Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground font-medium">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-foreground font-medium">
                    Resolution Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-card border-border"
                    required
                  />
                </div>
              </div>

              {/* Minimum Deposit */}
              <div className="space-y-2">
                <Label htmlFor="minDeposit" className="text-foreground font-medium">
                  Minimum Proposal Deposit (AVAX) *
                </Label>
                <Input
                  id="minDeposit"
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={formData.minDeposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, minDeposit: e.target.value }))}
                  className="bg-card border-border"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Amount required for users to submit resolution proposals
                </p>
              </div>

              {/* Market Proposals Section */}
              <Card className="bg-muted/10 border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Market Proposals</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Create specific predictions for this market. Each proposal will have YES/NO options.
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {formData.category && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateProposalExamples}
                          className="btn-outline-quantum"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Generate Examples
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addProposal}
                        className="btn-outline-quantum"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Proposal
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {proposals.map((proposal, index) => (
                    <Card key={proposal.id} className="bg-card border-border/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">Proposal {index + 1}</h4>
                          {proposals.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProposal(proposal.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Proposal Title *</Label>
                            <Input
                              placeholder="e.g., BTC increases by $20,000"
                              value={proposal.title}
                              onChange={(e) => updateProposal(proposal.id, 'title', e.target.value)}
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Resolution Date *</Label>
                            <Input
                              type="datetime-local"
                              value={proposal.endDate}
                              onChange={(e) => updateProposal(proposal.id, 'endDate', e.target.value)}
                              className="bg-background border-border"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Description *</Label>
                          <Textarea
                            placeholder="Detailed description of what needs to happen for this proposal to resolve as YES..."
                            value={proposal.description}
                            onChange={(e) => updateProposal(proposal.id, 'description', e.target.value)}
                            className="bg-background border-border min-h-[80px]"
                          />
                        </div>

                        {formData.category === 'crypto' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Price Direction</Label>
                              <Select 
                                value={proposal.direction} 
                                onValueChange={(value) => updateProposal(proposal.id, 'direction', value)}
                              >
                                <SelectTrigger className="bg-background border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="increase">Increase</SelectItem>
                                  <SelectItem value="decrease">Decrease</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Target Amount ($)</Label>
                              <Input
                                type="number"
                                placeholder="1000"
                                value={proposal.targetPrice}
                                onChange={(e) => updateProposal(proposal.id, 'targetPrice', e.target.value)}
                                className="bg-background border-border"
                              />
                            </div>
                          </div>
                        )}

                        {/* Proposal Preview */}
                        <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                          <div className="text-xs text-muted-foreground mb-2">Preview:</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-success/10 border border-success/20 rounded p-2 text-center">
                              <div className="text-xs font-medium text-success mb-1">YES</div>
                              <div className="text-sm text-success">This will happen</div>
                            </div>
                            <div className="bg-destructive/10 border border-destructive/20 rounded p-2 text-center">
                              <div className="text-xs font-medium text-destructive mb-1">NO</div>
                              <div className="text-sm text-destructive">This won't happen</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Market Rules */}
              <Card className="bg-muted/20 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Market Creation Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Markets must be based on verifiable, real-world events</p>
                  <p>• Resolution criteria must be clear and objective</p>
                  <p>• End date must be in the future</p>
                  <p>• You will need to pay gas fees for market creation</p>
                  <p>• Markets cannot be edited once created</p>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="btn-quantum flex-1" 
                  disabled={isPending || isConfirming || isCreating}
                >
                  {isPending || isConfirming || isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isCreating ? 'Creating Market...' : 'Confirming...'}
                    </>
                  ) : (
                    'Create Market'
                  )}
                </Button>
                <Button type="button" variant="outline" className="btn-outline-quantum flex-1">
                  Preview Market
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMarket;