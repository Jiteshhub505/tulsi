import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const AddToCart = ({ id }: { id: string }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  async function handleCart() {
    setLoading(true);
    const response = await axios.post("/api/cart/addtocart", {
      session,
      productId: id,
    });
    if (response.data.success) {
      console.log("Ok");
      window.dispatchEvent(new Event("cart-updated"));
      setLoading(false);
      toast("Added to cart!", {
        duration: 4000,
        position: "top-center",

        style: {
          background: "#16a34a",
          color: "#fff",
          fontWeight: "500",
        },

        icon: "👏",
      });
    } else {
      console.log(response.data.error);
      setLoading(false);
      toast.error("Failed to add into cart");
    }
  }

  return (
    <div>
      {loading ? (
        <Button className="w-full">
          <Loader2 className="w-full animate-spin" />
        </Button>
      ) : (
        <Button className="w-full cursor-pointer" onClick={handleCart}>
          Add To Cart
        </Button>
      )}
    </div>
  );
};

export default AddToCart;
