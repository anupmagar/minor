function Nav() {
  return (
    <nav>
      <div className="   flex ">
        <div className="flex justify-between">
          <a className="group focus:outline-none focus-visible:outline-none focus:ring-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-primary-hover rounded">
            logo
          </a>
        </div>
        <ul className="hidden xl:flex flex-grow items-center gap-5 xl:gap-8 my-0">
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
        <ul className="hidden flex-none xl:flex items-center gap-4 xl:gap-8 my-0">
          <li>
            <a
              href="/login"
              className="group flex items-center cursor-pointer transition ease-in-out no-underline no-touch-hover:hover:text-brand-typo active:text-brand-typo text-typo py-6 focus:outline-none focus-visible:outline-none focus:ring-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-primary-hover rounded"
              draggable="true"
            >
              Log in
            </a>
          </li>
          <li>
            <a
              role="button"
              href="/signup"
              className="!border !border-transparent rounded-full font-bold transition ease-in-out text-center font-body no-underline hover:no-underline inline-flex items-center justify-center text-base px-6 h-11 active:scale-[0.98] text-typo !bg-secondary hover:!bg-secondary-hover active:!bg-secondary-hover focus:outline-none focus-visible:outline-none focus:ring-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-primary-hover"
            >
              Sign up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
