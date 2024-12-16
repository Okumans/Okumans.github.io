import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// import { Image } from "astro:assets";

type ImagePopUpProps = {
  children: React.ReactNode; // Accepts any valid React children
};

export const ImagePopUp: React.FC<ImagePopUpProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger className="max-w-96 h-full w-full">
        {children}
      </DialogTrigger>
      <DialogContent className="flex justify-center w-10/12 h-fit lg:w-fit lg:h-git max-w-none overflow-scroll">
        <div className="max-w-max lg:max-w-none min-h-full overflow-scroll">
          <div className="w-[100vh] h-auto overflow-scroll touch-auto">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
