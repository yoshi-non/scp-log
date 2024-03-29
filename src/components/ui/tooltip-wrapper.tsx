import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

type Props = {
  children: React.ReactNode;
  text: string;
};

/**
 * TooltipWrapper component
 * @param {React.ReactNode} children
 * @param {string} text
 * @returns {JSX.Element}
 */
export const TooltipWrapper = ({
  children,
  text,
}: Props): JSX.Element => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="border-0">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
