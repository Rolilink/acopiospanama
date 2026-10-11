import { PublishForm } from '@/components/account/publish-form';
import { mapTileHost } from '@/lib/public-server';

export const metadata = { title: 'Publicar un centro — Acopio Panamá' };

export default function PublishPage() {
  return <PublishForm tileHost={mapTileHost()} />;
}
