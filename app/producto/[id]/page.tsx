import { Suspense } from 'react';
import ProductDetail from '../../components/main/productDetail';

async function Detalle({ params }: { params: PageProps<'/producto/[id]'>['params'] }) {
  const { id } = await params;
  return <ProductDetail id={Number(id)} />;
}

export default function ProductoPage({ params }: PageProps<'/producto/[id]'>) {
  // El id se conoce hasta el momento de la petición (las publicaciones nuevas
  // no existen en build), por eso va dentro de <Suspense>.
  return (
    <Suspense>
      <Detalle params={params} />
    </Suspense>
  );
}
