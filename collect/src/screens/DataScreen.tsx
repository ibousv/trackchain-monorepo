import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Download, MapPin, Calendar, User, Package } from 'lucide-react';
import { CollectedData } from '../App';
import { toast } from 'sonner';
import { useCapacitor } from '../src/hooks/useCapacitor';

interface DataScreenProps {
  data: CollectedData[];
}

export default function DataScreen({ data }: DataScreenProps) {
  const { shareContent, saveFile } = useCapacitor();
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const parseMetadata = (metadata: string) => {
    try {
      return JSON.parse(metadata || '{}');
    } catch {
      return {};
    }
  };

  const handleExport = async () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const filename = `track-collect-data-${new Date().toISOString().split('T')[0]}.json`;
      
      // Essayer de sauvegarder ou partager via Capacitor
      const saved = await saveFile(filename, dataStr);
      
      if (saved) {
        toast.success('Export réussi', {
          description: 'Les données ont été sauvegardées'
        });
      } else {
        // Fallback: essayer de partager
        await shareContent(
          'Export Track-Collect',
          `Données Track-Collect (${data.length} enregistrements)`,
          `data:application/json;base64,${btoa(dataStr)}`
        );
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible d\'exporter les données'
      });
    }
  };

  const getEventTypeColor = (eventType: string) => {
    const colorMap: Record<string, string> = {
      'Plantation': 'bg-green-500',
      'Arrosage': 'bg-blue-500',
      'Fertilisation': 'bg-yellow-500',
      'Traitement': 'bg-orange-500',
      'Récolte': 'bg-purple-500',
      'Transformation': 'bg-pink-500',
      'Conditionnement': 'bg-indigo-500',
      'Transport': 'bg-gray-500',
      'Stockage': 'bg-cyan-500',
      'Vente': 'bg-emerald-500'
    };
    return colorMap[eventType] || 'bg-gray-500';
  };

  if (data.length === 0) {
    return (
      <div className="p-4 space-y-6">
        <Card className="border-black/10">
          <CardContent className="p-8">
            <div className="text-center text-black/60">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-black mb-2">Aucune donnée</h3>
              <p>Commencez par enregistrer vos premières données</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header avec export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Données Collectées</h2>
          <p className="text-sm text-black/60">
            {data.length} enregistrement{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="border-black/20">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Liste des données */}
      <div className="space-y-3">
          {data.map((item) => {
            const metadata = parseMetadata(item.metadata);
            const eventColorClass = getEventTypeColor(item.event_type);
            
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
                    <Badge className={`${eventColorClass} text-white border-0`}>
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

                  <p className="text-xs text-black/40 italic">
                    Créé le {formatDate(item.created_at)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}