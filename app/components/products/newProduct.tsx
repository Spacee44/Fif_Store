'use client';

import { useRouter } from 'next/navigation';
import { crearProducto } from '../../lib/store';
import PhoneShell from '../ui/phoneShell';
import TopBar from '../ui/topBar';
import ProductForm from './productForm';

export default function NewProduct() {
  const router = useRouter();

  return (
    <PhoneShell>
      <TopBar titulo="Nueva Publicacion" />
      <main className="flex-grow overflow-y-auto">
        <ProductForm
          textoBoton="Publicar"
          onGuardar={(datos) => {
            const id = crearProducto(datos);
            router.replace(`/producto/${id}`);
          }}
        />
      </main>
    </PhoneShell>
  );
}
