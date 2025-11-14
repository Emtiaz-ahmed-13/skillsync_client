<Link
  href={
    plan.buttonText === "Contact Sales"
      ? "/contact"
      : plan.buttonText === "Get Started"
      ? "/auth/register"
      : "/auth/register"
  }
>
  {plan.buttonText}
</Link>;
