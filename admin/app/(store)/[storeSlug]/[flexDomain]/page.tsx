import { redirect } from "next/navigation";

type Props = {
  params: {
    storeSlug: string;
  };
};

const FlexDomain = ({ params }: Props) => {
  return redirect(`/${params.storeSlug}`);
};

export default FlexDomain;
