import { UpdateIcon } from '@radix-ui/react-icons';

export default function Loading() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <UpdateIcon className="my-4 size-12 animate-spin" />
      Loading...
    </div>
  );
}
