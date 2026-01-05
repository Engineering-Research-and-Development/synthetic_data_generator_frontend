<script>
    import {Navbar, NavBrand, NavHamburger, NavLi, NavUl} from "flowbite-svelte";
</script>

<Navbar class="fixed w-full bg-opacity-30 top-0 backdrop-blur-lg shadow-md z-50">
    <NavBrand href="/">
        <img src="ENG-LOGO-LIGHT.png" class="me-3 h-6 sm:h-9" alt="Eng Logo" />
        <img src="ctw_white.png" class="h-16 sm:h-16" alt="Eng Logo" />
    </NavBrand>
    <NavHamburger />
    <NavUl>
        <NavLi class="text-white" href="/">Home</NavLi>
        <NavLi class="text-white" href="/settings">Settings</NavLi>
    </NavUl>
</Navbar>