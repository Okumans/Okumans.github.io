import { Card, CardHeader, CardDescription, CardTitle } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FaExternalLinkAlt } from "react-icons/fa";
import React from "react";
import { toast } from "sonner";

interface ContactCardProps {
  title: string;
  description: string;
  tooltipContent?: string;
  targetContent?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  title,
  description,
  tooltipContent = "Copy to clipboard.",
  targetContent = "",
  className = "",
  children,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "w-fit hover:scale-[98%] transform ease-in-out transition-transform",
              className,
            )}
            onClick={() => {
              navigator.clipboard.writeText(targetContent);
              toast("Copied!", {
                description: `copied "${targetContent}" to clipboard.`,
              });
            }}
          >
            <CardHeader className="w-full p-3 px-5">
              <span className="flex gap-3 items-center">
                {children}
                <span className="flex flex-col">
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </span>
              </span>
            </CardHeader>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ContactCardWithLink: React.FC<ContactCardProps> = ({
  title,
  description,
  tooltipContent = "Go to link.",
  href = "/",
  className = "",
  children,
}) => {
  return (
    <a href={href} className="w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={cn(
                "w-fit hover:scale-[98%] transform ease-in-out transition-transform",
                className,
              )}
            >
              <CardHeader className="w-full p-3 px-5">
                <span className="flex gap-3 items-center justify-between">
                  <span className="flex h-full items-center gap-3">
                    {children}
                    <span className="flex flex-col">
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </span>
                  </span>
                  <FaExternalLinkAlt />
                </span>
              </CardHeader>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {tooltipContent} {`(${href})`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </a>
  );
};
