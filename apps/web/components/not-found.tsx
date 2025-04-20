import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

const NotFound = ({
  title,
  btnContent,
  btnAction,
}: {
  title: string;
  btnContent: string;
  btnAction: () => void;
}) => {
  return (
    <div className="min-h-screen flex items-center w-full justify-center bg-white dark:bg-black">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-[#c32b4b] dark:bg-[#ffdee2] bg-opacity-50">
              <AlertTriangle className="w-12 h-12 text-[#ea384c]" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-[#1A1F2C] dark:text-gray-100 mt-6">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#403E43] dark:text-white">
              {title}
            </h2>
          </div>
          <div className="pt-4">
            <Button
              variant="default"
              className="transition-colors duration-300 gap-2"
              onClick={btnAction}
            >
              {btnContent}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
