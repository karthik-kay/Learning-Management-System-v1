import { ArrowRight } from "lucide-react";

import Image from "next/image";

export function CommunityTopPicks() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Community Top Picks
      </h3>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex -space-x-2">
            <Image
              src="/assets/avatar-placeholder_variant_1.png"
              alt="User 1"
              width={24}
              height={24}
              className="rounded-full border-2 border-white"
            />
            <Image
              src="/assets/avatar-placeholder_variant_2.png"
              alt="User 2"
              width={24}
              height={24}
              className="rounded-full border-2 border-white"
            />
            <Image
              src="/assets/avatar-placeholder_variant_3.png"
              alt="User 3"
              width={24}
              height={24}
              className="rounded-full border-2 border-white"
            />
          </div>

          <span className="text-sm text-gray-600">+42</span>
        </div>

        <p className="text-sm text-gray-700 mb-3">
          Join the discussion on &quot;Future of AI in Education&quot;
        </p>

        <button className="group flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium">
          <span>Go to Community</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
