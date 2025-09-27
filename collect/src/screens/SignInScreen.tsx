import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { formatPhoneNumber, validatePhoneNumber, normalizePhoneNumber } from '../src/utils/phoneUtils';
import Logo from '../components/Logo';

interface SignInScreenProps {
  onSignIn: (phone: string, password: string) => void;
  onNavigateToSignUp: () => void;
}

export default function SignInScreen({ onSignIn, onNavigateToSignUp }: SignInScreenProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error('Erreur', {
        description: 'Veuillez remplir tous les champs'
      });
      return;
    }

    // Validation du numéro de téléphone
    if (!validatePhoneNumber(phone)) {
      toast.error('Erreur', {
        description: 'Numéro de téléphone invalide (format: 06 12 34 56 78)'
      });
      return;
    }

    // Normaliser le numéro avant de l'envoyer
    const normalizedPhone = normalizePhoneNumber(phone);
    onSignIn(normalizedPhone, password);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 max-w-md mx-auto">
      <Card className="w-full border-black/10">
        <CardHeader className="text-center space-y-4">
          <Logo size="lg" showText={true} />
          <CardDescription className="text-black/60">
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center justify-between">
                Numéro de téléphone
                <span className="text-xs text-black/40 font-normal">Format: 06 12 34 56 78</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                value={phone}
                onChange={(e) => {
                  const formattedPhone = formatPhoneNumber(e.target.value);
                  setPhone(formattedPhone);
                }}
                className="border-black/20 focus:border-black"
                maxLength={14} // Format XX XX XX XX XX
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-black/20 focus:border-black"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-black/60">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="text-black underline hover:no-underline"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}