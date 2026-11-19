import { Suspense } from 'react';
import ProfileView from '../../components/profile/profileView';

async function Perfil({ params }: { params: PageProps<'/vendedor/[id]'>['params'] }) {
  const { id } = await params;
  return <ProfileView usuarioId={id} />;
}

export default function VendedorPage({ params }: PageProps<'/vendedor/[id]'>) {
  return (
    <Suspense>
      <Perfil params={params} />
    </Suspense>
  );
}
