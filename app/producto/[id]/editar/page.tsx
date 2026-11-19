import { Suspense } from 'react';
import EditProduct from '../../../components/products/editProduct';

async function Editar({ params }: { params: PageProps<'/producto/[id]/editar'>['params'] }) {
  const { id } = await params;
  return <EditProduct id={Number(id)} />;
}

export default function EditarProductoPage({ params }: PageProps<'/producto/[id]/editar'>) {
  return (
    <Suspense>
      <Editar params={params} />
    </Suspense>
  );
}
