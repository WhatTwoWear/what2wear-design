import WardrobeClient from "./wardrobe-client"

export default function WardrobePage() {
  return <WardrobeClient />
}

import AddWardrobeItem from './AddWardrobeItem';

export default function WardrobePage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Neues Kleidungsstück</h1>
      <AddWardrobeItem />
    </div>
  );
}
