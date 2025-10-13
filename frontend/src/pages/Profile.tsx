import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';
import { UserIcon, TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { address } = useParams();

  // Mock profile data
  const profile = {
    address: address || '0x1234567890123456789012345678901234567890',
    username: 'CryptoTrader2024',
    joinDate: '2024-01-15',
    totalTrades: 147,
    winRate: '68%',
    totalVolume: '$45,230',
    reputation: 'Expert',
    marketsCreated: 12,
    marketsWon: 8,
  };

  const createdMarkets = [
    {
      id: '1',
      title: 'Will Ethereum exceed $5000 by Q2 2024?',
      status: 'active',
      volume: '$1.2M',
      participants: 234,
    },
    {
      id: '2',
      title: 'Will Apple announce new AR glasses in 2024?',
      status: 'resolved',
      volume: '$800K',
      participants: 156,
      outcome: 'NO',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'trade',
      description: 'Bought 100 YES tokens in Bitcoin $100K market',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'market',
      description: 'Created market: Tesla Stock Prediction',
      timestamp: '1 day ago',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="gradient-card border-border/50 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {profile.username}
                  </h1>
                  <p className="text-muted-foreground font-mono text-sm mb-2">
                    {profile.address.slice(0, 10)}...{profile.address.slice(-8)}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary text-primary-foreground">
                      {profile.reputation}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Joined {new Date(profile.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="btn-quantum">
                Follow
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card border-border/50">
            <CardContent className="p-6 text-center">
              <ChartBarIcon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">
                {profile.totalTrades}
              </div>
              <div className="text-muted-foreground text-sm">Total Trades</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-border/50">
            <CardContent className="p-6 text-center">
              <TrophyIcon className="w-8 h-8 text-success mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">
                {profile.winRate}
              </div>
              <div className="text-muted-foreground text-sm">Win Rate</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {profile.totalVolume}
              </div>
              <div className="text-muted-foreground text-sm">Total Volume</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {profile.marketsCreated}
              </div>
              <div className="text-muted-foreground text-sm">Markets Created</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="markets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border-border">
            <TabsTrigger value="markets" className="text-foreground">Created Markets</TabsTrigger>
            <TabsTrigger value="activity" className="text-foreground">Recent Activity</TabsTrigger>
            <TabsTrigger value="stats" className="text-foreground">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="markets" className="mt-6">
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Markets Created by {profile.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {createdMarkets.map((market) => (
                    <Card key={market.id} className="bg-muted/20 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground mb-2">
                              {market.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Volume: {market.volume}</span>
                              <span>Participants: {market.participants}</span>
                              {market.outcome && (
                                <Badge className={market.outcome === 'YES' ? 'bg-success' : 'bg-destructive'}>
                                  Resolved: {market.outcome}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={market.status === 'active' ? 'bg-success' : 'bg-muted'}>
                            {market.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <Card key={activity.id} className="bg-muted/20 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-foreground">{activity.description}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {activity.timestamp}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Trading Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Markets Won</span>
                      <span className="font-medium text-foreground">{profile.marketsWon}/{profile.marketsCreated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-success">{profile.winRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Volume</span>
                      <span className="font-medium text-foreground">{profile.totalVolume}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Market Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Markets Created</span>
                      <span className="font-medium text-foreground">{profile.marketsCreated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Markets</span>
                      <span className="font-medium text-foreground">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolved Markets</span>
                      <span className="font-medium text-foreground">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;