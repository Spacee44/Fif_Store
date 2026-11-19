import ProfileView from '../components/profile/profileView';
import { USUARIO_ACTUAL_ID } from '../lib/data';

export default function PerfilPage() {
  return <ProfileView usuarioId={USUARIO_ACTUAL_ID} />;
}
