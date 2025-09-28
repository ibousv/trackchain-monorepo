import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { formatPhoneNumber, validatePhoneNumber, normalizePhoneNumber } from '../src/utils/phoneUtils';
import Logo from '../components/Logo';
import CountrySelector, { getDefaultCountry, Country } from '../components/CountrySelector';

interface SignInScreenProps {
  onSignIn: (phone: string, password: string) => void;
  onNavigateToSignUp: () => void;
}

export default function SignInScreen({ onSignIn, onNavigateToSignUp }: SignInScreenProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
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

    // Normaliser le numéro avant de l'envoyer
    const normalizedPhone = normalizePhoneNumber(phone, selectedCountry);
    onSignIn(normalizedPhone, password);
  };

  return (
    <div className="form-screen bg-white max-w-md mx-auto">
      <div className="form-content flex items-center justify-center p-4">
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
    </div>
  );
}