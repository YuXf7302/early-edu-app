import { ChildProfile } from '../components/profile/ChildProfile';
import { FontSizeToggle } from '../components/shared/FontSizeToggle';

export function ProfilePage() {
  return (
    <div>
      <ChildProfile />
      <div className="px-4 pb-6">
        <div className="mt-2 pt-4 border-t border-warm-200">
          <FontSizeToggle />
        </div>
      </div>
    </div>
  );
}
