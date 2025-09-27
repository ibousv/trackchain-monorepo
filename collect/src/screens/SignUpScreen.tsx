import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { formatPhoneNumber, validatePhoneNumber, normalizePhoneNumber } from '../src/utils/phoneUtils';
import Logo from '../components/Logo';

interface SignUpScreenProps {
  onSignUp: (name: string, phone: string, password: string) => void;
  onNavigateToSignIn: () => void;
}

export default function SignUpScreen({ onSignUp, onNavigateToSignIn }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast.error('Erreur', {
        description: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    if (password.length < 6) {
      toast.error('Erreur', {
        description: 'Le mot de passe doit contenir au moins 6 caractères'
      });
      return;
    }

    // Normaliser le numéro avant de l'envoyer
    const normalizedPhone = normalizePhoneNumber(phone);
    onSignUp(name, normalizedPhone, password);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 max-w-md mx-auto">
      <Card className="w-full border-black/10">
        <CardHeader className="text-center space-y-4">
          <Logo size="lg" showText={true} />
          <CardDescription className="text-black/60">
            Créez votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-black/20 focus:border-black"
                required
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-black/20 focus:border-black"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
              S'inscrire
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-black/60">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={onNavigateToSignIn}
                className="text-black underline hover:no-underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}