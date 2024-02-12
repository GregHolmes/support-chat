import React, { useMemo } from "react";

type StatusProps = {
  whoIsCurrentlyTyping: string[];
  defaultText?: string;
  className?: string;
  clientId: string;
};

const Status = ({
  whoIsCurrentlyTyping,
  clientId = '',
  defaultText = "",
  className = "",
}: StatusProps) => {

  const opponentIsTyping = useMemo(
    () => whoIsCurrentlyTyping.filter((id: string) => id === clientId),
    [whoIsCurrentlyTyping, clientId]
  );

  return (
    <div className={`status ${className}`}>
      {opponentIsTyping.length > 0
        ? `${clientId} is typing…`
        : defaultText}
    </div>
  );
};

export default Status;