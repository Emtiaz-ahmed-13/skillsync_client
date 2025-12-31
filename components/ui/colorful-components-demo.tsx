"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/moving-border";

export function ColorfulComponentsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {/* 3D Card with Theme Colors */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          3D Card with Theme Colors
        </h2>
        <CardContainer className="inter-var">
          <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/20 dark:bg-background dark:border-border border-border w-auto h-auto rounded-xl p-6 border">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-foreground"
            >
              Themed 3D Card
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-muted-foreground text-sm max-w-sm mt-2"
            >
              This card uses your theme colors with primary, secondary, and
              accent colors
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="h-40 w-full bg-muted rounded-lg flex items-center justify-center">
                <span className="text-foreground">Themed Content</span>
              </div>
            </CardItem>
            <div className="flex justify-between items-center mt-6">
              <CardItem
                translateZ={20}
                className="px-4 py-2 rounded-xl text-xs font-normal text-foreground"
              >
                Learn more
              </CardItem>
              <CardItem translateZ={20}>
                <Button
                  borderRadius="1.75rem"
                  className="bg-primary text-primary-foreground border-none text-xs font-bold"
                >
                  Get Started
                </Button>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>

      {/* Moving Border Button with Theme Colors */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Moving Border Button
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Primary Button
            </h3>
            <Button
              borderRadius="1.75rem"
              className="bg-primary text-primary-foreground border-none font-bold"
            >
              Primary Button
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Secondary Button
            </h3>
            <Button
              borderRadius="1.75rem"
              className="bg-secondary text-secondary-foreground border-none font-bold"
            >
              Secondary Button
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Accent Button
            </h3>
            <Button
              borderRadius="1.75rem"
              className="bg-accent text-accent-foreground border-none font-bold"
            >
              Accent Button
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Destructive Button
            </h3>
            <Button
              borderRadius="1.75rem"
              className="bg-destructive text-destructive-foreground border-none font-bold"
            >
              Destructive Button
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
