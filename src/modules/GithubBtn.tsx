import { PiGithubLogo } from "react-icons/pi";

export const GithubBtn = () => (
  <a
    href="https://github.com/yet3/char-typer"
    target="_blank"
    rel="noreferrer noopener"
    className="fixed bottom-4 right-4 p-3 border border-primary rounded-lg cursor-pointer group hover:border-content-accent transition-colors"
  >
    <PiGithubLogo
      size={22}
      className="group-hover:fill-content-accent fill-content-primary transition-colors"
    />
  </a>
);
