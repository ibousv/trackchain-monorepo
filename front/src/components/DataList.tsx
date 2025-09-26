import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Download, MapPin, Calendar, User, Package } from 'lucide-react';
import { CollectedData } from './DataCollectionForm';

interface DataListProps {
  data: CollectedData[];
  onExport?: () => void;
}

export function DataList({ data, onExport }: DataListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseMetadata = (metadata: string) => {
    try {
      return JSON.parse(metadata || '{}');
    } catch {
      return {};
    }
  };

  const getEventTypeColor = (eventType: string) => {
    const colorMap: Record<string, string> = {
      'Plantation': 'bg-green-100 text-green-800',
      'Arrosage': 'bg-blue-100 text-blue-800',
      'Fertilisation': 'bg-yellow-100 text-yellow-800',
      'Traitement': 'bg-orange-100 text-orange-800',
      'Récolte': 'bg-purple-100 text-purple-800',
      'Transformation': 'bg-pink-100 text-pink-800',
      'Conditionnement': 'bg-indigo-100 text-indigo-800',
      'Transport': 'bg-gray-100 text-gray-800',
      'Stockage': 'bg-cyan-100 text-cyan-800',
      'Vente': 'bg-emerald-100 text-emerald-800'
    };
    return colorMap[eventType] || 'bg-gray-100 text-gray-800';
  };

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Données Collectées</CardTitle>
          <CardDescription>Aucune donnée collectée pour le moment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Commencez par enregistrer vos premières données</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Données Collectées</CardTitle>
            <CardDescription>
              {data.length} enregistrement{data.length > 1 ? 's' : ''} de traçabilité
            </CardDescription>
          </div>
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {data.map((item) => {
              const metadata = parseMetadata(item.metadata);
              return (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.asset_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{item.actor_id}</span>
                      </div>
                    </div>
                    <Badge className={getEventTypeColor(item.event_type)}>
                      {item.event_type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(item.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {Object.keys(metadata).length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Métadonnées :</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Créé le {formatDate(item.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}