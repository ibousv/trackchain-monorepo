import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

export interface CollectedData {
  id: string;
  asset_id: string;
  actor_id: string;
  event_type: string;
  event_date: string;
  location: string;
  metadata: string;
  created_at: string;
}

interface DataCollectionFormProps {
  onDataSubmit: (data: Omit<CollectedData, 'id' | 'created_at'>) => void;
}

export function DataCollectionForm({ onDataSubmit }: DataCollectionFormProps) {
  const [formData, setFormData] = useState({
    asset_id: '',
    actor_id: '',
    event_type: '',
    event_date: '',
    location: '',
    metadata: ''
  });

  const eventTypes = [
    'Plantation',
    'Arrosage',
    'Fertilisation',
    'Traitement',
    'Récolte',
    'Transformation',
    'Conditionnement',
    'Transport',
    'Stockage',
    'Vente'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!formData.asset_id || !formData.actor_id || !formData.event_type || 
        !formData.event_date || !formData.location) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onDataSubmit(formData);
    
    // Réinitialiser le formulaire
    setFormData({
      asset_id: '',
      actor_id: '',
      event_type: '',
      event_date: '',
      location: '',
      metadata: ''
    });

    toast.success('Données collectées avec succès');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Collecte de Données</CardTitle>
        <CardDescription>
          Enregistrez les données de traçabilité pour vos actifs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset_id">ID de l'Actif *</Label>
              <Input
                id="asset_id"
                placeholder="ex: PARCEL_001, BATCH_123"
                value={formData.asset_id}
                onChange={(e) => handleInputChange('asset_id', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actor_id">ID de l'Acteur *</Label>
              <Input
                id="actor_id"
                placeholder="ex: OWNER_001, FARMER_123"
                value={formData.actor_id}
                onChange={(e) => handleInputChange('actor_id', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_type">Type d'Événement *</Label>
              <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type d'événement" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Date de l'Événement *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localisation *</Label>
            <Input
              id="location"
              placeholder="ex: Ferme Nord, Parcelle A, Entrepôt Central"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata">Métadonnées (JSON)</Label>
            <Textarea
              id="metadata"
              placeholder='{"temperature": 25, "humidity": 60, "quantity": "100kg", "quality": "Grade A"}'
              value={formData.metadata}
              onChange={(e) => handleInputChange('metadata', e.target.value)}
              className="min-h-20"
            />
            <p className="text-sm text-muted-foreground">
              Format JSON pour les données spécifiques au domaine
            </p>
          </div>

          <Button type="submit" className="w-full">
            Enregistrer les Données
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}