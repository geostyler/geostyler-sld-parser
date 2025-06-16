<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <Name>Filter with OGC Function</Name>
        <UserStyle>
            <Name>Filter with OGC Function</Name>
            <Title>Filter with OGC Function</Title>
            <FeatureTypeStyle>
                <Rule>
                    <Name>Filter with OGC Function</Name>
                    <ogc:Filter
                        xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:And>
                            <ogc:PropertyIsGreaterThan>
                                <ogc:Mul>
                                    <ogc:Div>
                                        <ogc:PropertyName>men_pauv</ogc:PropertyName>
                                        <ogc:PropertyName>men</ogc:PropertyName>
                                    </ogc:Div>
                                    <ogc:Literal>100</ogc:Literal>
                                </ogc:Mul>
                                <ogc:Literal>25</ogc:Literal>
                            </ogc:PropertyIsGreaterThan>
                            <ogc:PropertyIsLessThanOrEqualTo>
                                <ogc:Mul>
                                    <ogc:Div>
                                        <ogc:PropertyName>men_pauv</ogc:PropertyName>
                                        <ogc:PropertyName>men</ogc:PropertyName>
                                    </ogc:Div>
                                    <ogc:Literal>100</ogc:Literal>
                                </ogc:Mul>
                                <ogc:Literal>36</ogc:Literal>
                            </ogc:PropertyIsLessThanOrEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#ff5e23</CssParameter>
                        </Fill>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>