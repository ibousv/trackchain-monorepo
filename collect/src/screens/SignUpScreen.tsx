import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { formatPhoneNumber, validatePhoneNumber, normalizePhoneNumber } from '../src/utils/phoneUtils';
import Logo from '../components/Logo';
import CountrySelector, { getDefaultCountry, Country } from '../components/CountrySelector';

interface SignUpScreenProps {
  onSignUp: (name: string, phone: string, password: string) => void;
  onNavigateToSignIn: () => void;
}

export default function SignUpScreen({ onSignUp, onNavigateToSignIn }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !password || !confirmPassword) {
      toast.error('Erreur', {
        description: 'Veuillez remplir tous les champs'
      });
      return;
    }

    // Validation du numéro de téléphone
    if (!validatePhoneNumber(phone, selectedCountry)) {
      toast.error('Erreur', {
        description: `Numéro de téléphone invalide (format: ${selectedCountry.placeholder})`
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
    const normalizedPhone = normalizePhoneNumber(phone, selectedCountry);
    onSignUp(name, normalizedPhone, password);
  };

  return (
    <div className="form-screen bg-white max-w-md mx-auto">
      <div className="form-content flex items-center justify-center p-4">
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
              <Label htmlFor="country">Pays</Label>
              <CountrySelector 
                selectedCountry={selectedCountry}
                onCountryChange={(country) => {
                  setSelectedCountry(country);
                  setPhone(''); // Reset le numéro quand on change de pays
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center justify-between">
                Numéro de téléphone
                <span className="text-xs text-black/40 font-normal">Format: {selectedCountry.placeholder}</span>
              </Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 py-2 bg-black/5 border border-black/20 rounded-md">
                  <span className="text-sm font-medium text-black/70">{selectedCountry.dialCode}</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={selectedCountry.placeholder}
                  value={phone}
                  onChange={(e) => {
                    const formattedPhone = formatPhoneNumber(e.target.value, selectedCountry);
                    setPhone(formattedPhone);
                  }}
                  className="flex-1 border-black/20 focus:border-black"
                  maxLength={selectedCountry.maxLength}
                  required
                />
              </div>
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
    </div>
  );
}