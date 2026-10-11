import { EditCenter } from '@/components/account/edit-center';
import { mapTileHost } from '@/lib/public-server';

export default function EditCenterPage() {
  return <EditCenter tileHost={mapTileHost()} />;
}
