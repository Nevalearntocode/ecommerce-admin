import React from 'react'

type Props = {
    label: string
}

const NoResults = ({label}: Props) => {
  return (
    <div className="flex h-36 items-center justify-center rounded-md border">
      <p className="text-lg font-semibold">No {label} found.</p>
    </div>
  );
}

export default NoResults