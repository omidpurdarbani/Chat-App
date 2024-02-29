using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MyChat.Pages
{
    [AllowAnonymous]
    public class LoginModel : PageModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public string ReturnUrl { get; set; }


        public void OnGet(string returnUrl = null)
        {
            ReturnUrl = returnUrl;
        }


        public IActionResult OnPost([FromQuery] string returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            string username = Request.Form["username"];
            string password = Request.Form["password"];

            if (password != "omid") return Page();

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name,username),
                new Claim(ClaimTypes.Role,"support")
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var properties = new AuthenticationProperties
            {
                RedirectUri = returnUrl ?? Url.Content("~/")
            };

            return SignIn(new ClaimsPrincipal(identity), properties, CookieAuthenticationDefaults.AuthenticationScheme);
        }

    }
}