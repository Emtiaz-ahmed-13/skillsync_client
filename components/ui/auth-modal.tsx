'use client';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalTitle,
} from '@/components/ui/modal';
import { AtSignIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './button';
import { Input } from './input';

type AuthModalProps = Omit<React.ComponentProps<typeof Modal>, 'children'>;

export function AuthModal(props: AuthModalProps) {
	return (
		<Modal {...props}>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Sign In or Join Now!</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<p className="text-muted-foreground mb-4 text-start text-sm">
						<Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
						{" or "}
						<Link href="/auth/signup" className="text-primary hover:underline">create an account</Link>
					</p>
					<div className="relative h-max">
						<Input
							placeholder="your.email@example.com"
							className="peer ps-9"
							type="email"
						/>
						<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
							<AtSignIcon className="size-4" aria-hidden="true" />
						</div>
					</div>

					<Button
						type="button"
						variant="outline"
						className="animate-in fade-in mt-4 w-full duration-300"
                        onClick={() => {
                             // This is just UI for now, logic to be implemented
                            alert("Email login flow to be implemented");
                        }}
					>
						<span>Continue With Email</span>
					</Button>
				</ModalBody>
				<div className="p-4">
					<p className="text-muted-foreground text-center text-xs">
						By clicking Continue, you agree to our{' '}
						<Link className="text-foreground hover:underline" href="/policy">
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</ModalContent>
		</Modal>
	);
}
