namespace SvgHrefNameSpace {
    public static class ViteFunctions
    {
        public static string SvgHref(this string spriteName)
        {
            Random rnd = new Random();
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == Environments.Development)
            {
                return $"__spritemap/assets/svg/sprite.svg?{rnd.Next(10000000, 99999999)}#{spriteName}";
            }
            else
            {
                // assume production
                return $"./assets/svg/sprite.svg#{spriteName}";
            }
        }
    }

}