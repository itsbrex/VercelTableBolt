import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveApiKey, getApiKey, validateApiKey } from '@/lib/api-key-service';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const [aiCommand, setAiCommand] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [useOpenAI, setUseOpenAI] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadApiKey = async () => {
      const savedKey = await getApiKey();
      if (savedKey) {
        setApiKey(savedKey);
        setUseOpenAI(true);
      }
    };
    loadApiKey();
  }, []);

  const handleAICommand = () => {
    console.log('AI command:', aiCommand);
    console.log('Using OpenAI:', useOpenAI);
    // Implement AI command logic here
    setAiCommand('');
  };

  const handleSaveApiKey = async () => {
    try {
      const isValid = await validateApiKey(apiKey);
      if (isValid) {
        await saveApiKey(apiKey);
        toast({
          title: "API Key Saved",
          description: "Your OpenAI API key has been saved successfully.",
        });
        setUseOpenAI(true);
      } else {
        toast({
          title: "Invalid API Key",
          description: "The provided API key is invalid. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the API key.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>AI Actions</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="ai-command"
              placeholder="Enter AI command..."
              value={aiCommand}
              onChange={(e) => setAiCommand(e.target.value)}
            />
            <Button onClick={handleAICommand}>Execute AI Command</Button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">OpenAI API Key</h3>
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey}>Save API Key</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="use-openai"
              checked={useOpenAI}
              onCheckedChange={setUseOpenAI}
            />
            <Label htmlFor="use-openai">Use OpenAI GPT-4</Label>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Suggested Actions:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Analyze data trends</li>
              <li>Generate report summary</li>
              <li>Predict future metrics</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}