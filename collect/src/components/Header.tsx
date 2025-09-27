import { Database, Users, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function Header() {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Track-Collect</h1>
        <p className="text-muted-foreground">
          Module de collecte de données pour la traçabilité multi-domaine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium">Owner</h3>
            <p className="text-sm text-muted-foreground">
              Propriétaires qui enregistrent les données
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium">Entity</h3>
            <p className="text-sm text-muted-foreground">
              Données transformées en entités
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium">Supervisor</h3>
            <p className="text-sm text-muted-foreground">
              Administration et régulation du système
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}