import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { LogOut, User, BarChart2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { displayPhoneNumber } from '../src/utils/phoneUtils';

interface User {
  phone: string;
  name: string;
}

interface SettingsScreenProps {
  user: User | null;
  dataCount: number;
  onSignOut: () => void;
}

export default function SettingsScreen({ user, dataCount, onSignOut }: SettingsScreenProps) {
  const handleSignOut = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      onSignOut();
    }
  };

  const handleAbout = () => {
    toast.info('À propos de Track-Collect', {
      description: 'Module de collecte de données pour la traçabilité multi-domaine'
    });
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Profil utilisateur */}
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-black/60">Nom</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-black/60">Téléphone</p>
            <p className="font-medium">{user?.phone ? displayPhoneNumber(user.phone) : 'Non renseigné'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm text-black/60">Données collectées</p>
            <p className="font-medium text-lg">{dataCount} enregistrement{dataCount > 1 ? 's' : ''}</p>
          </div>
        </CardContent>
      </Card>

      {/* À propos */}
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            À propos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Track-Collect</h3>
            <p className="text-sm text-black/60">
              Module de collecte de données pour la traçabilité multi-domaine
            </p>
          </div>
          
          <Separator className="bg-black/10" />
          
          <div className="space-y-2 text-sm text-black/60">
            <p>• <strong>Owner :</strong> Propriétaires qui enregistrent les données</p>
            <p>• <strong>Entity :</strong> Données transformées en entités</p>
            <p>• <strong>Supervisor :</strong> Administration du système</p>
          </div>

          <Button 
            variant="outline"
            onClick={handleAbout}
            className="w-full border-black/20"
          >
            Plus d'informations
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-black/10">
        <CardContent className="p-4">
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-black/40 space-y-1 pt-4">
        <p>Track-Collect v1.0.0</p>
        <p>© 2024 - Système de traçabilité</p>
      </div>
    </div>
  );
}