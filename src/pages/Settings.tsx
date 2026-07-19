import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleClearHistory = async () => {
    if (!confirm('Are you sure? This will permanently delete all your analysis history.')) return;
    const { error } = await supabase.from('analyses').delete().eq('user_id', user?.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('All analysis history cleared');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </motion.div>

      <div className="space-y-6">
        {/* Appearance */}
        <Card className="glass-strong p-6 border-border/50">
          <div className="flex items-center gap-2 mb-4">
            {theme === 'dark' ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <h2 className="font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Toggle between dark and light theme</p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card className="glass-strong p-6 border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Analysis Complete</Label>
                <p className="text-xs text-muted-foreground">Get notified when an analysis finishes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Summary</Label>
                <p className="text-xs text-muted-foreground">Receive a weekly financial summary</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="glass-strong p-6 border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" onClick={() => toast.info('Password change link sent to your email')}>
              Change Password
            </Button>
          </div>
        </Card>

        {/* Data */}
        <Card className="glass-strong p-6 border-border/50 border-rose-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="h-5 w-5 text-rose-400" />
            <h2 className="font-semibold text-rose-400">Danger Zone</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Clear All History</Label>
              <p className="text-xs text-muted-foreground">Permanently delete all your analysis records</p>
            </div>
            <Button variant="destructive" onClick={handleClearHistory}>
              Clear History
            </Button>
          </div>
        </Card>

        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
