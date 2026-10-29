import { Button } from './button';

type CalloutBannerProps = {
  text: string;
  action: { label: string; href: string };
};

/** Full-width dark banner with a line of text and a button, used to close out a page. */
export function CalloutBanner({ text, action }: CalloutBannerProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5 bg-bar px-6 py-8 text-on-bar lg:px-8">
      <p className="m-0 text-20 font-medium tracking-lead lg:text-24">{text}</p>
      <Button href={action.href} variant="light">
        {action.label}
      </Button>
    </div>
  );
}
