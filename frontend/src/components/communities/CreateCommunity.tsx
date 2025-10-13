import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/use-toast';

const COMMUNITY_ICONS = ['📈', '🎮', '⚽', '₿', '🗳️', '💻', '🎬', '🏠', '🌍', '🚀'];
const COMMUNITY_COLORS = [
  'text-success',
  'text-primary', 
  'text-warning',
  'text-quantum-orange',
  'text-destructive',
  'text-info',
  'text-purple-400',
  'text-pink-400',
  'text-green-400',
  'text-blue-400'
];

export const CreateCommunity = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📈',
    color: 'text-success'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically call an API to create the community
    console.log('Creating community:', formData);
    
    toast({
      title: "Community Created!",
      description: `${formData.name} community has been created successfully.`,
    });
    
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      icon: '📈',
      color: 'text-success'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-quantum">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., DeFi Enthusiasts"
              className="bg-background border-border"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this community is about..."
              className="bg-background border-border"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Choose Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {COMMUNITY_ICONS.map((icon, index) => (
                <Button
                  key={icon}
                  type="button"
                  variant={formData.icon === icon ? "default" : "outline"}
                  className={`h-12 text-2xl ${formData.icon === icon ? 'btn-quantum' : 'btn-outline-quantum'}`}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    icon, 
                    color: COMMUNITY_COLORS[index] 
                  }))}
                >
                  {icon}
                </Button>
              ))}
            </div>
          </div>
          
          <Card className="bg-muted/20 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{formData.icon}</span>
                <div>
                  <h3 className={`font-medium ${formData.color}`}>
                    {formData.name || 'Community Name'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formData.description || 'Community description'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="btn-quantum flex-1">
              Create Community
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="btn-outline-quantum flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};