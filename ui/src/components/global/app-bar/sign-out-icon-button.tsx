'use client';

import { signOut } from 'next-auth/react';
import { ExitIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function SignOutIconButton() {
  return (
    <Button variant="outline" size="icon" onClick={() => signOut()}
      className="space-x-4">
      <ExitIcon/>
    </Button>
  );
}
