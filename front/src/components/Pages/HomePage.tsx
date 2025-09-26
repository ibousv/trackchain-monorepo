import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { CollectedData } from '../DataCollectionForm';

interface HomePageProps {
  onDataSubmit: (data: Omit<CollectedData, 'id' | 'created_at'>) => void;
}

export function HomePage({ onDataSubmit }: HomePageProps) {
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
    
    if (!formData.asset_id || !formData.actor_id || !formData.event_type || 
        !formData.event_date || !formData.location) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onDataSubmit(formData);
    
    setFormData({
      asset_id: '',
      actor_id: '',
      event_type: '',
      event_date: '',
      location: '',
      metadata: ''
    });

    toast.success('Données enregistrées avec succès');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle>Nouvelle Collecte</CardTitle>
          <CardDescription className="text-black/60">
            Enregistrez vos données de traçabilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset_id">ID de l'Actif *</Label>
              <Input
                id="asset_id"
                placeholder="ex: PARCEL_001"
                value={formData.asset_id}
                onChange={(e) => handleInputChange('asset_id', e.target.value)}
                className="border-black/20 focus:border-black"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actor_id">ID de l'Acteur *</Label>
              <Input
                id="actor_id"
                placeholder="ex: OWNER_001"
                value={formData.actor_id}
                onChange={(e) => handleInputChange('actor_id', e.target.value)}
                className="border-black/20 focus:border-black"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_type">Type d'Événement *</Label>
              <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
                <SelectTrigger className="border-black/20 focus:border-black">
                  <SelectValue placeholder="Sélectionnez un type" />
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
                className="border-black/20 focus:border-black"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                placeholder="ex: Ferme Nord, Parcelle A"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="border-black/20 focus:border-black"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata">Métadonnées (optionnel)</Label>
              <Textarea
                id="metadata"
                placeholder='{"temperature": 25, "quantity": "100kg"}'
                value={formData.metadata}
                onChange={(e) => handleInputChange('metadata', e.target.value)}
                className="border-black/20 focus:border-black min-h-16"
              />
            </div>

            <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}