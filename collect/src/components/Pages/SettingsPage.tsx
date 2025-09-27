import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { LogOut, User, Database, Info } from 'lucide-react';

interface SettingsPageProps {
  userEmail: string;
  dataCount: number;
  onSignOut: () => void;
}

export function SettingsPage({ userEmail, dataCount, onSignOut }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      {/* Profil utilisateur */}
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-black/60">Email</p>
            <p className="font-medium">{userEmail}</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-black/60">Données collectées</p>
            <p className="font-medium">{dataCount} enregistrement{dataCount > 1 ? 's' : ''}</p>
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
            <p>• Owner : Propriétaires qui enregistrent les données</p>
            <p>• Entity : Données transformées en entités</p>
            <p>• Supervisor : Administration du système</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-black/10">
        <CardContent className="p-4">
          <Button 
            onClick={onSignOut}
            variant="outline"
            className="w-full border-black/20 text-black hover:bg-black hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}