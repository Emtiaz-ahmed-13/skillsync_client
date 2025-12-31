import { FreelancerReviews } from "@/components/features/dashboard/freelancer-reviews";
import { Navbar } from "@/components/shared/navbar";

export default function FreelancerReviewsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FreelancerReviews />
        </div>
      </div>
    </>
  );
}
