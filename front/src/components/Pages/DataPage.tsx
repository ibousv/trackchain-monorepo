import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Download, MapPin, Calendar, User, Package } from 'lucide-react';
import { CollectedData } from '../DataCollectionForm';

interface DataPageProps {
  data: CollectedData[];
  onExport?: () => void;
}

export function DataPage({ data, onExport }: DataPageProps) {
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

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-black/10">
          <CardHeader>
            <CardTitle>Données Collectées</CardTitle>
            <CardDescription className="text-black/60">
              Aucune donnée collectée pour le moment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-black/60">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Commencez par enregistrer vos premières données</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">Données Collectées</h2>
          <p className="text-sm text-black/60">
            {data.length} enregistrement{data.length > 1 ? 's' : ''}
          </p>
        </div>
        {onExport && (
          <Button variant="outline" onClick={onExport} className="border-black/20">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        )}
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-4">
          {data.map((item) => {
            const metadata = parseMetadata(item.metadata);
            return (
              <Card key={item.id} className="border-black/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-black/60" />
                        <span className="font-medium">{item.asset_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-black/60" />
                        <span className="text-sm text-black/60">{item.actor_id}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-black/20 text-black">
                      {item.event_type}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-black/60" />
                      <span>{formatDate(item.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-black/60" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {Object.keys(metadata).length > 0 && (
                    <div className="border-t border-black/10 pt-2 space-y-1">
                      <h4 className="text-sm font-medium">Métadonnées :</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-black/60">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}