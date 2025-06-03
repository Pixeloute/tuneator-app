import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Shield, 
  Info, 
  Mail, 
  Phone, 
  Building, 
  Globe,
  Music,
  Radio,
  Users,
  Briefcase,
  Settings,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { spotifyOAuthService } from "@/services/spotify-oauth-service";
import { appleMusicOAuthService } from "@/services/apple-music-oauth-service";
import { tuneCoreAPIService } from "@/services/tunecore-api-service";

interface Integration {
  name: string;
  icon: React.ReactNode;
  category: string;
  color: string;
  connected: boolean;
  description: string;
  isNew?: boolean;
}

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration | null;
  onConnect: (platformName: string, credentials: any) => Promise<boolean>;
}

interface PlatformField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'url' | 'number';
  placeholder: string;
  required: boolean;
  description?: string;
}

interface PlatformConfig {
  authMethod: 'oauth' | 'credentials' | 'api-key' | 'enterprise';
  fields: PlatformField[];
  instructions: string;
  helpUrl?: string;
  warningText?: string;
  category: string;
  enterpriseContact?: string;
}

const platformConfigs: Record<string, PlatformConfig> = {
  // Streaming Platforms
  'Spotify': {
    authMethod: 'oauth',
    category: 'Streaming',
    fields: [],
    instructions: 'You\'ll be redirected to Spotify to authorize access to your artist account.',
    helpUrl: 'https://artists.spotify.com/',
  },
  'Apple Music': {
    authMethod: 'oauth',
    category: 'Streaming',
    fields: [],
    instructions: 'Connect your Apple Music for Artists account via Apple\'s secure authentication.',
    helpUrl: 'https://artists.apple.com/',
  },
  'AUDIOMACK': {
    authMethod: 'credentials',
    category: 'Streaming',
    fields: [
      { name: 'username', label: 'Username', type: 'text', placeholder: 'Your Audiomack username', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your Audiomack password', required: true },
    ],
    instructions: 'Connect your Audiomack account to track your streaming data and fan engagement.',
    helpUrl: 'https://audiomack.com/support',
    warningText: 'We\'ll sync your track statistics and earnings data.',
  },
  'BANDCAMP': {
    authMethod: 'credentials',
    category: 'Platform',
    fields: [
      { name: 'username', label: 'Username', type: 'text', placeholder: 'Your Bandcamp username', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your Bandcamp password', required: true },
    ],
    instructions: 'Connect your Bandcamp account to sync sales and fan data.',
    helpUrl: 'https://bandcamp.com/help',
    warningText: 'We\'ll access your sales data and fan engagement metrics.',
  },

  // Distribution Platforms
  'DISTROKID': {
    authMethod: 'credentials',
    category: 'Distribution',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your DistroKid password', required: true },
      { name: 'twoFactorCode', label: '2FA Code (if enabled)', type: 'text', placeholder: '123456', required: false, description: 'Enter your 2FA code if you have two-factor authentication enabled' },
    ],
    instructions: 'Enter your DistroKid credentials to sync your releases and earnings data.',
    helpUrl: 'https://distrokid.com/help/',
    warningText: 'Your credentials are encrypted and stored securely. We only access your revenue and release data.',
  },
  'TUNECORE': {
    authMethod: 'api-key',
    category: 'Distribution',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', placeholder: 'Your TuneCore API key', required: true, description: 'Find this in your TuneCore account settings under API access' },
    ],
    instructions: 'Use your TuneCore API key to connect your distribution data.',
    helpUrl: 'https://www.tunecore.com/help',
  },
  'CD BABY': {
    authMethod: 'credentials',
    category: 'Distribution',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your CD Baby password', required: true },
    ],
    instructions: 'Connect your CD Baby account to sync distribution and sales data.',
    helpUrl: 'https://cdbaby.com/help',
    warningText: 'We\'ll access your sales reports and distribution data.',
  },
  'AWAL': {
    authMethod: 'credentials',
    category: 'Distribution',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your AWAL password', required: true },
    ],
    instructions: 'Connect your AWAL account to sync distribution and analytics data.',
    helpUrl: 'https://awal.com/help',
    warningText: 'We\'ll access your distribution reports and streaming analytics.',
  },
  'THE ORCHARD': {
    authMethod: 'credentials',
    category: 'Distribution',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your Orchard password', required: true },
    ],
    instructions: 'Connect your Orchard account to sync distribution data.',
    helpUrl: 'https://theorchard.com/help',
    warningText: 'We\'ll access your distribution and earnings data.',
  },
  'STEM': {
    authMethod: 'api-key',
    category: 'Distribution',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', placeholder: 'Your STEM API key', required: true, description: 'Get this from your STEM dashboard settings' },
    ],
    instructions: 'Use your STEM API key to connect distribution and fan engagement data.',
    helpUrl: 'https://stem.is/help',
  },
  'UNITED MASTERS': {
    authMethod: 'credentials',
    category: 'Distribution',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your UnitedMasters password', required: true },
    ],
    instructions: 'Connect your UnitedMasters account to sync distribution and brand partnership data.',
    helpUrl: 'https://unitedmasters.com/help',
    warningText: 'We\'ll access your distribution reports and partnership opportunities.',
  },

  // PROs (Performance Rights Organizations)
  'BMI': {
    authMethod: 'credentials',
    category: 'PRO',
    fields: [
      { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Your BMI account number', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your BMI password', required: true },
    ],
    instructions: 'Connect your BMI account to track performance royalties and statements.',
    helpUrl: 'https://www.bmi.com/',
    warningText: 'We\'ll access your royalty statements and performance data.',
  },
  'ASCAP': {
    authMethod: 'credentials',
    category: 'PRO',
    fields: [
      { name: 'memberNumber', label: 'Member Number', type: 'text', placeholder: 'Your ASCAP member number', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your ASCAP password', required: true },
    ],
    instructions: 'Connect your ASCAP account to track performance royalties.',
    helpUrl: 'https://www.ascap.com/',
  },
  'SESAC': {
    authMethod: 'credentials',
    category: 'PRO',
    fields: [
      { name: 'memberNumber', label: 'Member Number', type: 'text', placeholder: 'Your SESAC member number', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your SESAC password', required: true },
    ],
    instructions: 'Connect your SESAC account to track performance royalties.',
    helpUrl: 'https://www.sesac.com/',
  },
  'SOUND EXCHANGE': {
    authMethod: 'credentials',
    category: 'PRO',
    fields: [
      { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Your SoundExchange account number', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your SoundExchange password', required: true },
    ],
    instructions: 'Connect your SoundExchange account to track digital performance royalties.',
    helpUrl: 'https://www.soundexchange.com/',
    warningText: 'We\'ll access your digital performance royalty statements.',
  },
  'PRS': {
    authMethod: 'credentials',
    category: 'PRO',
    fields: [
      { name: 'memberNumber', label: 'Member Number', type: 'text', placeholder: 'Your PRS member number', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your PRS password', required: true },
    ],
    instructions: 'Connect your PRS account to track UK performance royalties.',
    helpUrl: 'https://www.prsformusic.com/',
  },

  // Publishers
  'KOBALT': {
    authMethod: 'credentials',
    category: 'Publisher',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your Kobalt password', required: true },
    ],
    instructions: 'Connect your Kobalt account to track publishing and rights data.',
    helpUrl: 'https://www.kobaltmusic.com/',
    warningText: 'We\'ll access your publishing statements and rights information.',
  },
  'SONGTRUST': {
    authMethod: 'credentials',
    category: 'Publisher',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your Songtrust password', required: true },
    ],
    instructions: 'Connect your Songtrust account to track global publishing royalties.',
    helpUrl: 'https://www.songtrust.com/',
    warningText: 'We\'ll access your publishing statements and collection data.',
  },

  // Enterprise/Labels
  'SONY MUSIC': {
    authMethod: 'enterprise',
    category: 'Label',
    fields: [],
    instructions: 'Enterprise integration for Sony Music. Contact your A&R representative for setup.',
    enterpriseContact: 'Contact your Sony Music A&R representative or business development team.',
  },
  'UNIVERSAL MUSIC': {
    authMethod: 'enterprise',
    category: 'Label',
    fields: [],
    instructions: 'Enterprise integration for Universal Music Group. Contact your label representative for setup.',
    enterpriseContact: 'Contact your Universal Music Group representative or business development team.',
  },
  'WARNER MUSIC GROUP': {
    authMethod: 'enterprise',
    category: 'Label',
    fields: [],
    instructions: 'Enterprise integration for Warner Music Group. Contact your label representative for setup.',
    enterpriseContact: 'Contact your Warner Music Group representative or business development team.',
  },

  // Default fallback
  'DEFAULT': {
    authMethod: 'credentials',
    category: 'Unknown',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your password', required: true },
    ],
    instructions: 'Connect your account to sync your data.',
    helpUrl: undefined,
    warningText: undefined,
  },
};

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  integration,
  onConnect,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  if (!integration) return null;

  const config = platformConfigs[integration.name] || {
    authMethod: 'credentials' as const,
    category: 'Unknown',
    fields: [
      { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'your@email.com', required: true },
      { name: 'password', label: 'Password', type: 'password' as const, placeholder: 'Your password', required: true },
    ],
    instructions: `Connect your ${integration.name} account to sync your data.`,
    helpUrl: undefined,
    warningText: undefined,
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleOAuthConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (integration.name === 'Spotify') {
        const success = await spotifyOAuthService.connect();
        if (success) {
          toast({
            title: "Connection Successful",
            description: `${integration.name} has been connected successfully.`,
          });
          onClose();
        } else {
          setError('Failed to connect to Spotify. Please try again.');
        }
      } else if (integration.name === 'Apple Music') {
        const success = await appleMusicOAuthService.connect();
        if (success) {
          toast({
            title: "Connection Successful",
            description: `${integration.name} has been connected successfully.`,
          });
          onClose();
        } else {
          setError('Failed to connect to Apple Music. Please try again.');
        }
      } else {
        // For other OAuth platforms, use the original flow
        const oauthUrl = `${window.location.origin}/api/auth/${integration.name.toLowerCase().replace(/\s+/g, '-')}/oauth`;
        window.location.href = oauthUrl;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start OAuth flow. Please try again.';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCredentialsConnect = async () => {
    setIsConnecting(true);
    setError(null);

    // Validate required fields
    const missingFields = config.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      setIsConnecting(false);
      return;
    }

    try {
      let success = false;
      
      // Handle platform-specific authentication
      if (integration.name === 'TUNECORE') {
        success = await tuneCoreAPIService.connect({ apiKey: formData.apiKey });
      } else {
        success = await onConnect(integration.name, formData);
      }
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: `${integration.name} has been connected successfully.`,
        });
        onClose();
      } else {
        setError('Failed to connect. Please check your credentials and try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Distribution': return <Music className="w-4 h-4" />;
      case 'PRO': return <Radio className="w-4 h-4" />;
      case 'Publisher': return <Globe className="w-4 h-4" />;
      case 'Label': return <Building className="w-4 h-4" />;
      case 'Streaming': return <TrendingUp className="w-4 h-4" />;
      case 'Platform': return <Music className="w-4 h-4" />;
      case 'Rights': return <Settings className="w-4 h-4" />;
      case 'Union': return <Users className="w-4 h-4" />;
      case 'Sync': return <Briefcase className="w-4 h-4" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Distribution': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'PRO': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Publisher': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Label': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Streaming': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'Platform': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'Rights': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'Union': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Sync': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const renderEnterpriseFlow = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: integration.color }}
          >
            {integration.icon}
          </div>
          <div className="flex flex-col gap-2">
            <span>Connect to {integration.name}</span>
            <div className="flex items-center gap-2">
              {getCategoryIcon(config.category)}
              <Badge variant="secondary" className={`text-xs ${getCategoryColor(config.category)}`}>
                {config.category}
              </Badge>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                Enterprise
              </Badge>
            </div>
          </div>
        </CardTitle>
        <CardDescription>{config.instructions}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Building className="h-4 w-4" />
          <AlertDescription>
            This is an enterprise integration that requires special setup and approval.
            {config.enterpriseContact && (
              <div className="mt-2 text-sm">
                <strong>Contact:</strong> {config.enterpriseContact}
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Email Integration Team</p>
              <p className="text-sm text-muted-foreground">integrations@tuneator.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Schedule a Call</p>
              <p className="text-sm text-muted-foreground">Book a consultation with our team</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => window.open('mailto:integrations@tuneator.com?subject=Enterprise Integration Request - ' + integration.name, '_blank')} 
          className="w-full" 
          size="lg"
        >
          <Mail className="h-4 w-4 mr-2" />
          Contact Integration Team
        </Button>
      </CardContent>
    </Card>
  );

  const renderOAuthFlow = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: integration.color }}
          >
            {integration.icon}
          </div>
          <div className="flex flex-col gap-2">
            <span>Connect to {integration.name}</span>
            <div className="flex items-center gap-2">
              {getCategoryIcon(config.category)}
              <Badge variant="secondary" className={`text-xs ${getCategoryColor(config.category)}`}>
                {config.category}
              </Badge>
            </div>
          </div>
        </CardTitle>
        <CardDescription>{config.instructions}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You'll be securely redirected to {integration.name} to authorize access.
            We only request read-only access to your revenue and release data.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleOAuthConnect} 
          className="w-full" 
          size="lg"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect with {integration.name}
            </>
          )}
        </Button>

        {config.helpUrl && (
          <div className="text-center">
            <a 
              href={config.helpUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Need help? Visit {integration.name} support →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCredentialsForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: integration.color }}
          >
            {integration.icon}
          </div>
          <div className="flex flex-col gap-2">
            <span>Connect to {integration.name}</span>
            <div className="flex items-center gap-2">
              {getCategoryIcon(config.category)}
              <Badge variant="secondary" className={`text-xs ${getCategoryColor(config.category)}`}>
                {config.category}
              </Badge>
            </div>
          </div>
        </CardTitle>
        <CardDescription>{config.instructions}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {config.warningText && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{config.warningText}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id={field.name}
                  type={field.type === 'password' && showPassword[field.name] ? 'text' : field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className={field.type === 'password' ? 'pr-10' : ''}
                />
                {field.type === 'password' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => togglePasswordVisibility(field.name)}
                  >
                    {showPassword[field.name] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCredentialsConnect} 
          className="w-full" 
          size="lg"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Connecting...
            </>
          ) : (
            `Connect ${integration.name}`
          )}
        </Button>

        {config.helpUrl && (
          <div className="text-center">
            <a 
              href={config.helpUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Need help? Visit {integration.name} support →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Integration</DialogTitle>
          <DialogDescription>
            Securely connect your {integration.name} account to sync your data.
          </DialogDescription>
        </DialogHeader>

        {config.authMethod === 'oauth' 
          ? renderOAuthFlow() 
          : config.authMethod === 'enterprise' 
          ? renderEnterpriseFlow() 
          : renderCredentialsForm()}
      </DialogContent>
    </Dialog>
  );
}; 