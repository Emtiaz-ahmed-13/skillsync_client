"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/moving-border";

export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/20 dark:bg-background dark:border-border border-border w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold text-foreground">
          Make things float in air
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-muted-foreground text-sm max-w-sm mt-2"
        >
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as="a"
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal text-foreground"
          >
            Try now →
          </CardItem>
          <CardItem translateZ={20}>
            <Button
              borderRadius="1.75rem"
              className="bg-primary text-primary-foreground border-none text-xs font-bold"
            >
              Sign up
            </Button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export function MovingBorderDemo() {
  return (
    <div>
      <Button
        borderRadius="1.75rem"
        className="bg-primary text-primary-foreground border-none font-bold"
      >
        Click Me
      </Button>
    </div>
  );
}
