import { Suspense } from "react";
import UserSpecificAction from "./UserSpecficAction";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <UserSpecificAction />
    </Suspense>
  );
}
