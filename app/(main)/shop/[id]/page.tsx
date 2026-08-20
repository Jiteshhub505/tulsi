import SingleProduct from "@/components/shopping/SingleProduct";

export const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <SingleProduct id={id} />
    </div>
  );
};

export default page;
