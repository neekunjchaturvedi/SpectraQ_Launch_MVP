import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';

const CreateProposal = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    evidence: '',
    outcome: '',
  });

  // Mock market data
  const market = {
    id: id || '1',
    title: 'Will Bitcoin reach $100,000 by end of 2024?',
    minDeposit: '0.1 ETH',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This would be replaced with actual contract interaction
      console.log('Submitting proposal:', {
        ...formData,
        marketId: id,
        deposit: market.minDeposit
      });
      
      // Mock success - replace with actual contract call
      alert('Proposal submitted successfully!');
    } catch (error) {
      console.error('Proposal submission failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Back Button */}
        <Link to={`/markets/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-smooth">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Market
        </Link>

        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Submit Resolution Proposal</CardTitle>
            <p className="text-muted-foreground">
              Propose how this market should be resolved
            </p>
          </CardHeader>
          <CardContent>
            {/* Market Context */}
            <Card className="bg-muted/20 border-border/50 mb-6">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-foreground mb-2">Market:</h3>
                <p className="text-muted-foreground">{market.title}</p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge className="bg-warning text-warning-foreground">
                    Deposit Required: {market.minDeposit}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Proposal Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium">
                  Proposal Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Bitcoin reached $100,000 on December 15, 2024"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-card border-border"
                  required
                />
              </div>

              {/* Outcome Selection */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Proposed Outcome *
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.outcome === 'YES' ? 'default' : 'outline'}
                    className={formData.outcome === 'YES' ? 'bg-success text-success-foreground' : 'btn-outline-quantum'}
                    onClick={() => setFormData(prev => ({ ...prev, outcome: 'YES' }))}
                  >
                    YES - Market resolves to YES
                  </Button>
                  <Button
                    type="button"
                    variant={formData.outcome === 'NO' ? 'default' : 'outline'}
                    className={formData.outcome === 'NO' ? 'bg-destructive text-destructive-foreground' : 'btn-outline-quantum'}
                    onClick={() => setFormData(prev => ({ ...prev, outcome: 'NO' }))}
                  >
                    NO - Market resolves to NO
                  </Button>
                </div>
              </div>

              {/* Evidence */}
              <div className="space-y-2">
                <Label htmlFor="evidence" className="text-foreground font-medium">
                  Supporting Evidence *
                </Label>
                <Textarea
                  id="evidence"
                  placeholder="Provide detailed evidence supporting your proposed resolution. Include sources, links, and any relevant documentation..."
                  value={formData.evidence}
                  onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
                  className="bg-card border-border min-h-[150px]"
                  required
                />
              </div>

              {/* Warning Box */}
              <Card className="bg-warning/10 border-warning/20">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-warning">Important Notice</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• You must deposit {market.minDeposit} to submit this proposal</li>
                        <li>• Your deposit will be returned if the proposal is accepted</li>
                        <li>• False or malicious proposals may result in deposit forfeit</li>
                        <li>• The community will vote on proposal validity</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="btn-quantum flex-1">
                  Submit Proposal ({market.minDeposit})
                </Button>
                <Button type="button" variant="outline" className="btn-outline-quantum flex-1">
                  Save Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProposal;