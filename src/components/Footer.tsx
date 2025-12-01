export default function Footer() {
    return (
        <footer className="bg-white shadow-inner mt-8">
            <div className="max-w-7xl mx-auto py-4 px-6">
                <p className="text-center text-sm text-gray-600">
                    &copy  {new Date().getFullYear()} • SJAM • Todos os direitos reservados.
                </p>
            </div>
        </footer>
    )
}
