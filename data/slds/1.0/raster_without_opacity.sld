<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">
    <sld:NamedLayer>
        <sld:Name>Default Styler</sld:Name>
        <sld:UserStyle>
            <sld:Name>Default Styler</sld:Name>
            <sld:Title>Default Styler</sld:Title>
            <sld:FeatureTypeStyle>
                <sld:Name>name</sld:Name>
                <sld:Rule>
                    <sld:RasterSymbolizer>
                        <sld:ColorMap type="intervals">
                            <sld:ColorMapEntry color="#ffffff" opacity="1.0" quantity="1.0001"/>
                            <sld:ColorMapEntry color="#ff0000" opacity="1.0" quantity="50000.0001"/>
                            <sld:ColorMapEntry color="#ffff00" opacity="1.0" quantity="100000.0001"/>
                            <sld:ColorMapEntry color="#00aa00" opacity="1.0" quantity="10000000" label="100000 &lt; x"/>
                        </sld:ColorMap>
                        <sld:ContrastEnhancement/>
                    </sld:RasterSymbolizer>
                </sld:Rule>
            </sld:FeatureTypeStyle>
        </sld:UserStyle>
    </sld:NamedLayer>
</sld:StyledLayerDescriptor>
